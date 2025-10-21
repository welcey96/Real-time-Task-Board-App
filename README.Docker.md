### References
* [Docker's Node.js guide](https://docs.docker.com/language/nodejs/)

```yaml

docker build -t ws-frontend-dev --target dev Dockerfile.dev .
```

```-t ws-frontend-dev``` → gives the image a name/tag.

```--target dev```  → tells Docker to build up to the dev stage in your multi-stage Dockerfile.

``` -f Dockerfile.dev```  → specifies the Dockerfile (if it’s named Dockerfile.dev; otherwise just Dockerfile).

```.```  → build context (current directory).


```yaml

docker run -e DOCKER=true -p 4200:4200 --name ws-frontend ws-frontend-dev
```

```docker run```

This tells Docker to start a container from an image.

```-e DOCKER=true```

Sets an environment variable inside the container.

Here, your code can check process.env.DOCKER to know it's running in Docker.

```-p 4200:4200```

Maps host port 4200 (your computer) to container port 4200.

This allows you to access the frontend in your browser via http://localhost:4200.

```--name ws-frontend```

Gives the container a friendly name instead of a random one.

Makes it easier to start, stop, or remove the container later.

```ws-frontend-dev```

This is the name/tag of the Docker image you’re using to create the container.