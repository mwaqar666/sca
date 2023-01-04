## Project Pre-Requisites

1. Node.js
2. Postgres
3. Redis

## Web Server Configuration

### 1. Apache

For API Server

```
  <VirtualHost *:80>
	ServerName api.test
	ServerAlias api.test
	ServerAdmin webmaster@localhost

	ProxyPreserveHost On
	ProxyPass / http://localhost:3000/
	ProxyPassReverse / http://localhost:3000/

	ErrorLog ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

<br>
For Agent Dashboard

```
<VirtualHost *:80>
	ServerName agent.test
	ServerAlias agent.test
	ServerAdmin webmaster@localhost

	RewriteEngine on
	RewriteRule /(.*) ws://localhost:4200/$1 [P,L]

	ProxyPreserveHost On
	ProxyPass / http://localhost:4200/
	ProxyPassReverse / http://localhost:4200/

	ErrorLog ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

<br>
For Customer Dashboard

```
<VirtualHost *:80>
	ServerName customer.test
	ServerAlias customer.test
	ServerAdmin webmaster@localhost

	RewriteEngine on
	RewriteRule /(.*) ws://localhost:4201/$1 [P,L]

	ProxyPreserveHost On
	ProxyPass / http://localhost:4201/
	ProxyPassReverse / http://localhost:4201/

	ErrorLog ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

<br>
For Agent Socket

```
<VirtualHost *:80>
	ServerName agent-socket.test
	ServerAlias agent-socket.test
	ServerAdmin webmaster@localhost

	RewriteEngine on
	RewriteRule /(.*) ws://localhost:3001/$1 [P,L]

	ProxyPreserveHost On
	ProxyPass / http://localhost:3001/
	ProxyPassReverse / http://localhost:3001/

	ErrorLog ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

<br>
For Customer Socket

```
<VirtualHost *:80>
	ServerName customer-socket.test
	ServerAlias customer-socket.test
	ServerAdmin webmaster@localhost

	RewriteEngine on
	RewriteRule /(.*) ws://localhost:3002/$1 [P,L]

	ProxyPreserveHost On
	ProxyPass / http://localhost:3002/
	ProxyPassReverse / http://localhost:3002/

	ErrorLog ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

## Application Configuration

- Copy `config/backend/.env.example` to `config/backend/.env.[environment]` where `[environment] = dev | qa | uat | prod`
- Copy `config/frontend/.env.example` to `config/frontend/.env.[environment]` where `[environment] = dev | qa | uat | prod`
- After copying the above files, configure the variables mentioned in them accordingly.
