const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const expenseRoutes = require('./routes/expenseRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');
const reportRoutes = require('./routes/reportRoutes');

// OBSERVER: register the notification observers once, at startup, against the
// single shared NotificationCenter (Singleton). Everything that publishes an
// event later (e.g. the expense Facade) reaches these listeners.
const NotificationCenter = require('./designpatterns/observer/NotificationCenter');
const { ConsoleLogObserver, InAppNotificationObserver } = require('./designpatterns/observer/observers');

const inAppNotifications = new InAppNotificationObserver();
NotificationCenter.getInstance()
    .subscribe(new ConsoleLogObserver())
    .subscribe(inAppNotifications);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/expenses', expenseRoutes);
console.log('Category routes loaded');
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);

connectDB();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
