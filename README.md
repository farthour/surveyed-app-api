# surveyed-app-api
API for surveyed package

Majorly for survey generation

### Run boilerplate code

- `npm install`
- Create a `.env` file in the root of the project
- Paste the below code in `.env` file and configure it according to your app, then
- Go to `http://localhost:7000/api/users/all` to see it in action

```
NODE_ENV=development
PORT=7000
MONGODB_URI=mongodb://<DB_USERNAME>:<DB_PASSWORD>@<DB_ADDRESS>:<DB_PORT>/<DB_NAME>
...
```

#### **`.env`**

- Create a `.env` file in the root of the project
- Store your environment variables in this file, in the above defined format

#### **`server/`**

- Contains all your server specific code
