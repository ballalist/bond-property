const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

app.get('/api', (req,res) => res.status(403).send('forbidden'))
app.post('/api/login', (req,res) => {
	let user = {
		userName: 'balallist',
		email: 'waranon.tiamsang@gmail.com'
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
	let user = req.user
	res.json(user)
})

// const authMiddleware = (req,res,next) => {
// 	res.send(req.headers)
// }

function authMiddleware(req,res,next) {
	if(typeof req.headers.authorization !== 'undefined') {
		let token = req.headers.authorization.split(' ');
		jwt.verify(token[1], 'bondpropertyt0k4n', function(err, decoded) {
			if(!err) {
				req.user = decoded
				next()
				// res.json(decoded)
			} else {
				res.status(403).json({error: 'forbidden'})
			}
		})
	} else {
		res.status(403).json({error: 'forbidden'})
	}
}

app.listen(3000, () => console.log('Example app listening on port 3000!'))