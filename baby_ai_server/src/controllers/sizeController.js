const { predictSize } = require("../services/aiService");
const { Measurement, Clothes, Size } = require("../models");
const { Op, where } = require("sequelize");

const PRODUCT_FILTER_FIELDS = [
  "id",
  "product_id",
  "product_name",
  "retailer_id",
  "fabric_id",
  "color_id",
  "gender_id",
  "brand_id",
  "category_id",
  "is_best_seller",
];

function buildProductFilter(payload) {
  const where = {};

  for (const field of PRODUCT_FILTER_FIELDS) {
    const value = payload[field];

    if (value !== undefined && value !== null && value !== "") {
      where[field] = value;
    }
  }

  return where;
}

function normalizeSizeIds(payload) {
  const rawValue =
    payload.available_size_ids ||
    payload.size_ids ||
    payload.product_size_ids ||
    payload.available_sizes;

  if (!rawValue) {
    return [];
  }

  const list = Array.isArray(rawValue) ? rawValue : [rawValue];

  return [
    ...new Set(
      list
        .map((item) => {
          if (typeof item === "number") {
            return item;
          }

          if (
            typeof item === "string" &&
            item.trim() !== "" &&
            !Number.isNaN(Number(item))
          ) {
            return Number(item);
          }

          if (
            item &&
            typeof item === "object" &&
            item.id !== undefined &&
            !Number.isNaN(Number(item.id))
          ) {
            return Number(item.id);
          }

          return null;
        })
        .filter((item) => Number.isInteger(item) && item > 0),
    ),
  ];
}

async function resolveAvailableSizeIds(payload, productWhere, productData) {
  const explicitSizeIds = normalizeSizeIds(payload);

  if (explicitSizeIds.length > 0) {
    return explicitSizeIds;
  }

  if (Object.keys(productWhere).length === 0) {
    return [];
  }

  // const products = await Clothes.findAll({
  //   where: productWhere,
  //   attributes: ["size_id"],
  //   raw: true,
  // });

  const filteredProducts = productData
    ? productData.filter((product) => {
        return Object.keys(productWhere).every((key) => {
          if (productWhere[key] === undefined || productWhere[key] === null)
            return true;

          return String(product[key]) === String(productWhere[key]);
        });
      })
    : [];

  const products = filteredProducts.map((product) => ({
    size_id: product.size_id,
  }));

  return [
    ...new Set(
      products
        .map((product) => product.size_id)
        .filter((sizeId) => Number.isInteger(sizeId) && sizeId > 0),
    ),
  ];
}

function extractAiPayload(payload, availableSizeIds) {
  const aiPayload = {
    height: payload.height,
    weight: payload.weight,
    chest: payload.chest,
    waist: payload.waist,
    hip: payload.hip,
  };

  if (payload.landmarks) {
    aiPayload.landmarks = payload.landmarks;
  }

  if (availableSizeIds.length > 0) {
    aiPayload.available_size_ids = availableSizeIds;
  }

  return aiPayload;
}

async function getRecommendedSize(req, res) {
  try {
    const productWhere = buildProductFilter(req.body);
    const productData = req.body.products;
    const productSize = req.body.productSize;
    const availableSizeIds = await resolveAvailableSizeIds(
      req.body,
      productWhere,
      productData,
    );
    const aiPayload = extractAiPayload(req.body, availableSizeIds);
    const aiResult = await predictSize(aiPayload);

    const recommendedSizeId =
      aiResult?.data?.recommendedSizeId ??
      aiResult?.recommended_size_id ??
      null;

    const recommendedSizeName =
      aiResult?.data?.recommendedSizeName ?? aiResult?.recommended_size ?? null;

    const measurements =
      aiResult?.data?.measurements ?? aiResult?.measurements ?? null;

    if (!measurements || !recommendedSizeName) {
      return res.status(502).json({
        status: 502,
        success: false,
        message: "AI service returned an invalid response",
      });
    }

    // const isMeasurement = await Measurement.findOne({
    //   where: {
    //     recommended_size: recommendedSizeName,
    //   },
    // });
    // if (!isMeasurement) {
    //   await Measurement.create({
    //     height: measurements.height,
    //     weight: measurements.weight,
    //     chest: measurements.chest,
    //     waist: measurements.waist,
    //     hip: measurements.hip,
    //     recommended_size: recommendedSizeName,
    //   });
    // }

    // const recommendedSize = recommendedSizeId
    //   ? await Size.findByPk(recommendedSizeId, { raw: true })
    //   : null;

    const sizeListArray =
      typeof productSize === "string" ? JSON.parse(productSize) : productSize;

    const recommendedSize =
      sizeListArray && recommendedSizeId
        ? sizeListArray.find((size) => size.id === Number(recommendedSizeId)) ||
          null
        : null;

    const clothesWhere = { ...productWhere };

    if (recommendedSizeId) {
      clothesWhere.size_id = recommendedSizeId;
    }

    // const clothes = await Clothes.findAll({
    //   where: {
    //     ...clothesWhere,
    //     sale_price: {
    //       [Op.gt]: 0,
    //     },
    //   },
    // });

    const clothes = productData
      ? productData.filter((product) => {
          const isOnSale = Number(product.sale_price) > 0;
          if (!isOnSale) return false;
          const matchesAllFilters = Object.keys(clothesWhere).every((key) => {
            if (clothesWhere[key] === undefined || clothesWhere[key] === null)
              return true;

            return String(product[key]) === String(clothesWhere[key]);
          });
          return matchesAllFilters;
        })
      : [];

    return res.json({
      status: 200,
      success: true,
      message: "Recommended size fetched successfully",
      data: {
        recommendedSize: recommendedSize || {
          id: recommendedSizeId,
          name: recommendedSizeName,
        },
        recommendedSizeId: recommendedSizeId,
        recommendedSizeName: recommendedSizeName,
        availableSizeIdsUsed:
          aiResult?.data?.availableSizeIdsUsed || availableSizeIds,
        measurements,
        products: clothes,
      },
      // recommended_size: recommendedSizeName,
      // recommended_size_id: recommendedSizeId,
      // measurements,
      // products: clothes,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Failed to fetch recommended size",
      error: err.message,
    });
  }
}

async function getSizes(req, res) {
  try {
    const allSizeList = await Size.findAll({
      order: [["id", "ASC"]],
      raw: true,
    });

    return res.json({
      status: 200,
      success: true,
      message: "Fetching all size list",
      data: {
        allSizeList,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Failed to fetch size list",
      error: err.message,
    });
  }
}

module.exports = { getRecommendedSize, getSizes };
