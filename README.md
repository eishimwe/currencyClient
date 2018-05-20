## Installation

### Step 1
Update app.js config with your api laravel  webserver url
```php
app.config(['currencyServiceProvider',function(currencyServiceProvider){

    currencyServiceProvider.config("http://127.0.0.1:8000");

}]);

```


### Step 2
In the root directory of the cloned project.

```bash
$ npm install http-server -g
```

### Step 3
In the root directory of the cloned project.run

```bash
$ http-server
```

### Step 4
Open your browser and go to the address generated in step 3
```bash
Starting up http-server, serving ./
Available on:

$ http://127.0.0.1:8080

```