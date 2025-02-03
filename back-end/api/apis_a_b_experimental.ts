/*/project-root
│── /api
│   ├── /routes
│   │   ├── passAnalysis.ts
│   │   ├── tollStationPasses.ts
│   │   ├── index.ts
│── /models
│   ├── pass.ts
│   ├── toll.ts
│   ├── tollOperator.ts
│── main.ts
│── package.json
│── README.md
│── .gitignore*/
//Handles /passAnalysis/:stationOpID/:tagOpID/:date_from/:date_to to analyze pass data between operators:
import express from 'express';
import Pass from '../../models/pass.ts';
import TollOperator from '../../models/toll_operator.ts';
import moment from 'npm:moment';

const router = express.Router();

router.get('/passAnalysis/:stationOpID/:tagOpID/:date_from/:date_to', async (req, res) => {
	try {
		const { stationOpID, tagOpID, date_from, date_to } = req.params;

		const startDate = moment(date_from, 'YYYY-MM-DD').toDate();
		const endDate = moment(date_to, 'YYYY-MM-DD').toDate();

		// Validate operators
		const stationOpExists = await TollOperator.findById(stationOpID);
		const tagOpExists = await TollOperator.findById(tagOpID);

		if (!stationOpExists || !tagOpExists) {
			return res.status(400).json({ error: 'Invalid Toll Operator IDs' });
		}

		// Fetch pass data
		const passes = await Pass.find({
			'tag.tollOperator': tagOpID,
			'toll.tollOperator': stationOpID,
			time: { $gte: startDate, $lte: endDate }
		}).populate('tag').populate('toll');

		res.json({ stationOpID, tagOpID, passes });
	} catch (error) {
		console.error('Error fetching pass analysis:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

export default router;
//Handles /tollStationPasses/:tollStationID/:date_from/:date_to to get passes per station:
import express from 'express';
import Pass from '../../models/pass.ts';
import Toll from '../../models/toll.ts';
import moment from 'npm:moment';

const router = express.Router();

router.get('/tollStationPasses/:tollStationID/:date_from/:date_to', async (req, res) => {
	try {
		const { tollStationID, date_from, date_to } = req.params;

		const startDate = moment(date_from, 'YYYY-MM-DD').toDate();
		const endDate = moment(date_to, 'YYYY-MM-DD').toDate();

		// Validate toll station
		const tollStationExists = await Toll.findById(tollStationID);
		if (!tollStationExists) {
			return res.status(400).json({ error: 'Invalid Toll Station ID' });
		}

		// Fetch pass data
		const passes = await Pass.find({
			toll: tollStationID,
			time: { $gte: startDate, $lte: endDate }
		}).populate('tag');

		res.json({ tollStationID, passes });
	} catch (error) {
		console.error('Error fetching toll station passes:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

export default router;
//In /api/routes/index.ts, register the API routes:
import express from 'express';
import passAnalysisRouter from './passAnalysis.ts';
import tollStationPassesRouter from './tollStationPasses.ts';

const router = express.Router();

router.use(passAnalysisRouter);
router.use(tollStationPassesRouter);

export default router;
//Modification of main.ts to use these routes:
import express from 'express';
import cors from 'npm:cors';
import mongoose from 'npm:mongoose';
import routes from './api/routes/index.ts';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', routes);

// Connect to MongoDB
async function startServer() {
	try {
		await mongoose.connect('mongodb://localhost:27017');
		console.log('Connected to MongoDB');
		app.listen(9115, () => console.log('Server running on port 9115'));
	} catch (error) {
		console.error('Database connection error:', error);
		process.exit(1);
	}
}

startServer();
