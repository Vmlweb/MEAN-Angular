## Insert User
---
Insert a new user into the database.

`POST /users`

### Body
- **username** - Username for the user to add
- **email** - E-mail address for the user to add

### Example Request
`POST /users`

```
{
	username: "MyUsername",
	email: "MyEmail@MyEmail.com"	
}
```

### Example Response
`200 OK`
