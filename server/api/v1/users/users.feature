Feature: Users
		
	Scenario: Insert User
		When listing users
		Then return 5 users
		
		Given username myUsername and email myEmail@email.com
		When insert user
		Then return identifier
		
		When listing users
		Then return 6 users

	Scenario: List User
		When listing users
		Then return 5 users
		Then return user 607f1f77bcf86cd799439011 with username of FirstUser
		Then return user 607f1f77bcf86cd799439011 with email of FirstUser@FirstUser.com