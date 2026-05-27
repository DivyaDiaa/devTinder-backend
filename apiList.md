### authRouter
- POST /signup
- POST /login
- POST /logout

### profileRouter
- GET /profile/view (logged in user data)
- PATCH /profile/edit (update the profile except password or email)
- PATCH /profile/password

### connectionRouter
The request which we send
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/send/:status/:userId

The request which is been sent to us
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId
- POST /request/review/:status/:userId

### userRouter
- GET /user/requests/received
- GET /connections
- GET /feed (profiles which comes into home page)

Status --> ignored, interested, accepted, rejected

