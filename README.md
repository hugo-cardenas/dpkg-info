# dpkg-info

Parse a file following the format of Debian's `/var/lib/dpkg/status` and serve a website which lists all packages and displays an info page for each package, allowing to navigate through package dependencies.

The project is composed of a Node.js server and a React application displaying the data.

### Development

In development, the Node server is serving only the API data and the React app is served by webpack-dev-server.

Run the server:
```
npm run start:dev:server
```
Run the app:
```
npm run start:dev:app
```

You can now access the app on <http://localhost:8081>, which will connect to the API served on <http://localhost:8080>.

In production, the whole app is just served under `domain:8080`

### Test

```
npm test
```

### Build and run with Docker
```
docker build -t dpkg-info .
```
```
docker run -p 8080:8080 -d dpkg-info
```

### Deploy

Deployment is using [Zeit Now v1](https://zeit.co/docs/v1/) with Docker.

```
npm run deploy
```
