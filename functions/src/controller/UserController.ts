import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);
var express = require('express');
var router = express.Router();
const db = admin.firestore();
const userCollection = 'users';

var routes = function() {
	interface User {
		firstName: String;
		lastName: String;
		email: String;
		areaNumber: String;
		department: String;
		contactNumber: String;
	}

	// Create new user
	router.post('/users', async function(req, res, next) {
		try {
			const user: User = {
				firstName: req.body['firstName'],
				lastName: req.body['lastName'],
				email: req.body['email'],
				areaNumber: req.body['areaNumber'],
				department: req.body['department'],
				contactNumber: req.body['contactNumber']
			};

			const newDoc = await db.collection(userCollection).add(user);
			res.status(201).send(`Created a new user: ${newDoc.id}`);
		} catch (error) {
			res
				.status(400)
				.send(
					`User should cointain firstName, lastName, email, areaNumber, department, id and contactNumber!!!`
				);
		}
	});
	//get all users
	router.get('/users', async function(req, res, next) {
		try {
			const userQuerySnapshot = await db.collection(userCollection).get();
			const users: any[] = [];
			userQuerySnapshot.forEach((doc) => {
				users.push({
					id: doc.id,
					data: doc.data()
				});
			});
			res.status(200).json(users);
		} catch (error) {
			res.status(500).send(error);
		}
	});

	router.get('/users/:userId', async function(req, res, next) {
		const userId = req.params.userId;
		await db
			.collection(userCollection)
			.doc(userId)
			.get()
			.then((user) => {
				if (!user.exists) throw new Error('User not found');
				res.status(200).json({ id: user.id, data: user.data() });
			})
			.catch((error) => res.status(500).send(error));
	});

	// Delete a user
	router.delete('/users/:userId', async function(req, res, next) {
		await db
			.collection(userCollection)
			.doc(req.params.userId)
			.delete()
			.then(() => res.status(204).send('Document successfully deleted!'))
			.catch(function(error) {
				res.status(500).send(error);
			});
	});

	// Update user
	router.put('/users/:userId', async function(req, res, next) {
		await db
			.collection(userCollection)
			.doc(req.params.userId)
			.set(req.body, { merge: true })
			.then(() => res.json({ id: req.params.userId }))
			.catch((error) => res.status(500).send(error));
	});
	return router;
};
module.exports = routes;
