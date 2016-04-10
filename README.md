# Thyme_App

### INSTALLING LOCALLY

#### First, install Sass

I am on 3.4.21 so if you use a different one and weird things happen that's a good place to look. 
```
gem install sass
```
Installs sass, use sudo if it fails. Check sass exists with sass -v before moving on, should say something like 
```
Sass 3.4.21 (Selective Steve)
```

Next, install the dependencies:
```
npm install
```
As usual, try it with sudo if output suggests you need Administrator privileges to run the command. 

### Starting the server
If you modify anything in the frontend_src directory's javascript or sass folders, it'll automatically prepare new compiled.js and style.css sheets, available on the browser when you refresh the page. Even if you're just looking to run the server, use
```
gulp watch & npm start
```
And you should be off to the races! Visit <https://localhost:3000> in your browser. 