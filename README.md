# easy-restaurant
A simple restaurant software that should make simple manage orders for cooks, waiters and barmen.
# easy-restaurant
A simple restaurant software that should make simple manage orders for cooks, waiters and barmen.

### RESTfull API list
```json
[
    {
        "method": "GET",
        "endpoint": "/api/v1/",
        "response": {
            "api_version": "1.0",
            "endpoints": ["{all endpoints of api v1}"]
        }
    },
    {
        "method": "POST",
        "endpoint": "/api/v1/register",
        "postParams": {
            "username": "{username as string}",
            "password": "{password as string}",
            "role": "{'cook' || 'waiter' || 'cashdesk' || 'bartender'}"
        },
        "response": {
            "user": {
                "_id": "{user id as string}",
                "username": "{username as string}",
                "password": "{hashed password as string}",
                "role": "{user role as string}",
                "sessions": [],
                "__v": 0
            }
        }
    },
    {
        "method": "POST",
        "endpoint": "/api/v1/login",
        "headers": {
            "Authorization": "`Basic ${base64(<username>:<password>)}`"
        },
        "response": {
            "error": false,
            "errormessage": "{error message as string}",
            "token": "{jwt token as string}",
            "session": "{refresh token as string}"
        }
    },
    {
        "method": "PUT",
        "endpoint": "/api/v1/tables/:tableNumber/orders/:orderId",
        "headers": {
            "Authorization": "`Bearer ${jwt token}`"
        },
        ...
    }
]
```