/**
 * @swagger
 * tags:
 *   name: Survey
 *   description: Survey management
 */

/**
 * @swagger
 * /survey:
 *   get:
 *     summary: Get all surveys
 *     description: Users can query surveys
 *     tags: [Survey]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Survey name
 *       - in: query
 *         name: searchForName
 *         schema:
 *           type: boolean
 *         description: Enable regex search for name instead of exact match. Default is false
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: categoryId (objectId)
 *       - in: query
 *         name: includeGeoSpecificSurveys
 *         schema:
 *           type: boolean
 *         description: Whether or not to include geo-specific surveys
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of surveys
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
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
 *                     $ref: '#/components/schemas/Survey'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *   post:
 *     summary: Create a survey
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
 *               - description
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               expireDate:
 *                 type: string
 *               questions:
 *                 type: array
 *             example:
 *               name: "This is a survey title!"
 *               description: "This is an example description text..."
 *               categoryId: 61c21efb7dd2d812a3759557
 *               expireDate: 2022-06-18
 *               questions: [
 *                 {
 *                   question_id: 1,
 *                   question_text: "Question 1",
 *                   answers: [
 *                     {
 *                       answer_id: 1,
 *                       answer_text: "Answer 1"
 *                     }
 *                   ]
 *                 }
 *               ]
 *     responses:
 *       "201":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Survey'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /survey/getByLocation:
 *   get:
 *     summary: Get geo-specific surveys based on lat-long location.
 *     description: Get geo-specific surveys based on lat-long location. Only returns valid surveys
 *     tags: [Survey]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         description: Latitude
 *       - in: query
 *         name: long
 *         schema:
 *           type: number
 *         description: Longitude
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
 *                     $ref: '#/components/schemas/Survey'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /survey/getById:
 *   post:
 *     summary: Get surveys by id (1-25)
 *     description: Users can query surveys by ids (min 1, max 25)
 *     tags: [Survey]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               id: ["61c21efb7dd2d812a3759557", "61c21efb7dd2d812a37595af"]
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
 *                     $ref: '#/components/schemas/Survey'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /survey/{id}:
 *   patch:
 *     summary: Update a survey
 *     description: For admins.
 *     tags: [Survey]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Survey id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               categoryId:
 *                 type: string
 *             example:
 *               name: "This is a survey title!"
 *               description: "This is an example description text..."
 *               categoryId: 61c21efb7dd2d812a3759557
 *               expireDate: 2022-06-18
 *     responses:
 *       "201":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Survey'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *   delete:
 *     summary: Delete a survey
 *     description: For admins.
 *     tags: [Survey]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Survey id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /survey/submit:
 *   post:
 *     summary: Submit survey answers
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
 *               - surveyId
 *               - answers
 *               - location
 *             properties:
 *               surveyId:
 *                 type: string
 *               location:
 *                 type: object
 *               answers:
 *                 type: array
 *             example:
 *               surveyId: 61cb1ceb26630302d76127ee
 *               location: {
 *                 lat: 41.008240,
 *                 long: 28.978359
 *               }
 *               answers: [
 *                 {
 *                   question_id: 1,
 *                   answer_id: 1
 *                 }
 *               ]
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "400":
 *         description: You already submitted this survey
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 400
 *               message: You already submitted this survey
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
 *               - rank
 *             properties:
 *               name:
 *                 type: string
 *               color:
 *                 type: string
 *               rank:
 *                 type: number
 *             example:
 *               name: Test Category
 *               color: "#FFA500"
 *               rank: 0
 *     responses:
 *       "201":
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
 *       "400":
 *         $ref: '#/components/responses/DuplicateCategoryRank'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /survey/categories/{id}:
 *   patch:
 *     summary: Update a category
 *     description: For admins.
 *     tags: [Survey]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               color:
 *                 type: string
 *               rank:
 *                 type: number
 *             example:
 *               name: Test Category
 *               color: "#FFA500"
 *               rank: 0
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Category'
 *       "400":
 *         $ref: '#/components/responses/DuplicateCategoryRank'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete a category
 *     description: For admins.
 *     tags: [Survey]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /survey/results/{id}:
 *   get:
 *     summary: Get all results for a survey
 *     tags: [Survey]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Survey id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/SurveyResults'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
