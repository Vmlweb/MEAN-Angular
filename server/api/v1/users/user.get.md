## Get Users
---
Gets a list of users from the database with a limit.

`GET /users`

### Parameters
- **limit** - Limit the number of results

### Response
- **[userId]** - Identifier of the user
- **[username]** - Username of the user
- **[email]** - E-mail address of the user

### Example Request
`GET /users`

```
{
	limit: 3
}
```

### Example Response
`200 OK`

```
{
	user: [
		{ userId: "607f1f77bcf86cd799439011", username: "FirstUser", email: "FirstUser@FirstUser.com" },
		{ userId: "607f1f77bcf86cd799439012", username: "SecondUser", email: "SecondUser@SecondUser.com" },
		{ userId: "607f1f77bcf86cd799439013", username: "ThirdUser", email: "ThirdUser@ThirdUser.com" }
	]
}
```

