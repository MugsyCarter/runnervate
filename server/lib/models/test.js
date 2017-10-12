const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

const schema = new Schema({
	// name: {
	// 	type: String,
	// 	required: true,
	// 	unique: true
	// },
	// //TODO Make house only possible if it's already in the database'
	// house: {
	// 	type: String,
	// 	required: true
	// },

	// female: {
	// 	type: Boolean,
	// 	required: true
	// },
	// //TODO make an armed boolean.  If true, then add weapon
	// // weapon: {
	// // 	type: String,
	// // 	required: true
	// // },
	// alive: {
	// 	type: Boolean,
	// 	default: true
	// },
	// age: {
	// 	type: Number, 
	// 	min: 0, 
	// 	max: 100,
	// 	required: true
	// }
});

module.exports = mongoose.model('Test', schema);