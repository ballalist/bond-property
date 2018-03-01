const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const redis = require('redis')

// redis
const client = redis.createClient({
    host: 'redis',
    port: '6379'
})

client.on('connect', function() {
    console.log('redis connected');
})
// redis

app.get('/api', (req,res) => res.status(403).send('forbidden'))
app.get('/api/test/redis', (req,res) => {
	// let user = {
	// 	userName: 'balallist',
	// 	email: 'waranon.tiamsang@gmail.com'
	// }
	// client.hmset('user', user, function(err, reply) {
	// 	if(err) {
	// 		res.status(500).json({error: 'redis server full'})
	// 	} else {
	// 		client.hgetall('user', function(err, reply) {
	// 			res.json(reply)
	// 		})
	// 	}
	// })
})
app.post('/api/login', (req,res) => {
	let user = {
		userName: 'balallist',
		email: 'waranon.tiamsang@gmail.com',
		gender: 'male',
		role: 'admin'
	}
	let token = jwt.sign(user, 'bondpropertyt0k4n', (err,token) => {
		if(!err) {
			res.json({token: token})
		} else {
			res.status(500).json({error: 'unable to get token'})
		}
	});
})

app.get('/api/authorized', authMiddleware, (req,res) => {
	let username = req.userName
	client.get(username, function(err, reply) {
		res.json(JSON.parse(reply))
	})
})

function authMiddleware(req,res,next) {
	if(typeof req.headers.authorization !== 'undefined') {
		let token = req.headers.authorization.split(' ');
		jwt.verify(token[1], 'bondpropertyt0k4n', function(err, decoded) {
			if(!err) {
				let stringUserObj = JSON.stringify(decoded)
				client.set(decoded.userName, stringUserObj, function(err, reply) {
					if(err) {
						res.status(500).json({error: err})
					}
				})
				req.userName = decoded.userName // will store this in localstorage instead
				next()
			} else {
				res.status(403).json({error: 'forbidden'})
			}
		})
	} else {
		res.status(403).json({error: 'forbidden'})
	}
}

app.listen(3000, () => console.log('Example app listening on port 3000!'))