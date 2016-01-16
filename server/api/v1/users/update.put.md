## Update User
---
Update a specific users details.

`PUT /users`

### Body
- **userId** - Identifier of the user to update
- **username** - New username to apply to user
- **email** - New email address to apply to user

### Example Request
`PUT /users`

```
{
	userId: "607f1f77bcf86cd799439013",
	username: "NewUsername",
	email: "NewEmail@NewEmail.com"
}
```

### Example Response
`200 OK`
