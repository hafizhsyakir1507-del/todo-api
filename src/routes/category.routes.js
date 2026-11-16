const express = require("express");
const { body, param } = require("express-validator");
const { protect } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const controller = require("../controllers/category.controller");

const router = express.Router();
router.use(protect);
const idRule = [param("id").isMongoId().withMessage("ID kategori tidak valid")];
const createRules = [body("name").trim().notEmpty().withMessage("Nama kategori wajib diisi").isLength({ max: 80 }), body("description").optional().isString().isLength({ max: 300 })];
const updateRules = [ ...idRule, body("name").optional().trim().notEmpty().isLength({ max: 80 }), body("description").optional().isString().isLength({ max: 300 }) ];

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Ambil semua kategori milik pengguna
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Daftar kategori }
 *   post:
 *     summary: Buat kategori
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: Pekerjaan }
 *               description: { type: string, example: Tugas kantor }
 *     responses:
 *       201: { description: Kategori dibuat }
 */
router.get("/", controller.getCategories);
router.post("/", createRules, validate, controller.createCategory);
/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Ambil detail kategori
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses:
 *       200: { description: Detail kategori }
 *   put:
 *     summary: Ubah kategori
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *     responses:
 *       200: { description: Kategori diperbarui }
 *   delete:
 *     summary: Arsipkan kategori dan lepaskan relasi todo
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses:
 *       200: { description: Kategori diarsipkan }
 */
router.get("/:id", idRule, validate, controller.getCategoryById);
router.put("/:id", updateRules, validate, controller.updateCategory);
router.delete("/:id", idRule, validate, controller.deleteCategory);
module.exports = router;
