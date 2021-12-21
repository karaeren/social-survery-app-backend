/**
 * @swagger
 * tags:
 *   name: Survey
 *   description: Survey management
 */

/**
 * @swagger
 * /survey/categories:
 *   get:
 *     summary: Get all categories
 *     description: For users to retrieve all categories.
 *     tags: [Survey]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                    $ref: '#/components/schemas/Category'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *   post:
 *     summary: Create a category
 *     description: For admins.
 *     tags: [Survey]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - color
 *             properties:
 *               name:
 *                 type: string
 *               color:
 *                 type: string
 *             example:
 *               name: Test Category
 *               color: "#FFA500"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
