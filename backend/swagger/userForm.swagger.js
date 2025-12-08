/**
 * @swagger
 * tags:
 *   name: UserForm
 *   description: User form submission and management with role-based access control
 */

/**
 * @swagger
 * /api/userform/submit:
 *   post:
 *     summary: Submit a new form
 *     description: Allows authenticated users to submit a form (requires canSubmitForm permission)
 *     tags: [UserForm]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - formData
 *             properties:
 *               formData:
 *                 type: object
 *                 additionalProperties: true
 *                 description: Form fields and values
 *           example:
 *             formData:
 *               name: "John Doe"
 *               email: "john@example.com"
 *               reason: "Project submission"
 *     responses:
 *       201:
 *         description: Form submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Form submitted successfully"
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad request - Invalid form data
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - User cannot submit form at this time
 */

/**
 * @swagger
 * /api/userform/my:
 *   get:
 *     summary: Get current user's form
 *     description: Retrieves the authenticated user's own form
 *     tags: [UserForm]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Form retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Form retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     formData:
 *                       type: object
 *                       additionalProperties: true
 *                     status:
 *                       type: string
 *                       enum: [draft, submitted, approved, rejected]
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Form not found
 */

/**
 * @swagger
 * /api/userform/edit/{formId}:
 *   put:
 *     summary: Edit a form (Admin/Mentor only)
 *     description: Allows admins and mentors to edit any form
 *     tags: [UserForm]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: formId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the form to edit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               formData:
 *                 type: object
 *                 additionalProperties: true
 *               status:
 *                 type: string
 *                 enum: [draft, submitted, approved, rejected]
 *           example:
 *             formData:
 *               name: "John Doe"
 *               email: "john@example.com"
 *               reason: "Updated project submission"
 *             status: "approved"
 *     responses:
 *       200:
 *         description: Form updated successfully
 *       400:
 *         description: Bad request - Invalid form data
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Admin/Mentor access required
 *       404:
 *         description: Form not found
 */

/**
 * @swagger
 * /api/userform/all:
 *   get:
 *     summary: Get all forms (Admin/Mentor only)
 *     description: Retrieves all forms in the system (admin/mentor access required)
 *     tags: [UserForm]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, submitted, approved, rejected]
 *         description: Filter by form status
 *     responses:
 *       200:
 *         description: Forms retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Forms retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     forms:
 *                       type: array
 *                       items:
 *                         type: object
 *                     total:
 *                       type: integer
 *                       example: 100
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     pages:
 *                       type: integer
 *                       example: 10
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Admin/Mentor access required
 */

/**
 * @swagger
 * /api/userform/history/{formId}:
 *   get:
 *     summary: Get form history (Admin/Mentor only)
 *     description: Retrieves the edit history of a specific form
 *     tags: [UserForm]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: formId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the form to retrieve history for
 *     responses:
 *       200:
 *         description: Form history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Form history retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     formId:
 *                       type: string
 *                     history:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           version:
 *                             type: integer
 *                           formData:
 *                             type: object
 *                             additionalProperties: true
 *                           updatedBy:
 *                             type: string
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Admin/Mentor access required
 *       404:
 *         description: Form not found
 */