import mongoose from "mongoose";

const subscriptionSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription Name is required'],
        trim: true,
        minLength: 2,
        maxLength: 100
    },
    price: {
        type: Number,
        required: [true, 'Subscription Price is required'],
        min: [0, 'Price must be greater than zero'],
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GDB', 'NGN'],
        default: 'NGN'
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly']
    },
    categoru: {
        type: String,
        enum: ['sports', 'news', 'entertainment', 'lifestyle', 'finance', 'technology', 'politics', 'other'],
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired'],
        default: 'active'
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value <= new Date(),
            message: 'Start Date must be in the past'
        }
    },
    renewalDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value >= this.startDate;
            },
            message: 'Renewal Date must be after the start date'
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }
}, { timestamps: true })

//Auto calculate renewal date if missing
subscriptionSchema.pre('save', function (next) {
    if (!this.renewalDate) {
        const renewalDates = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        }
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalDates[this.frequency])

    }

    if (this.renewalDate < new Date()) {
        this.status = 'expired'
    }
    next();
})

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;