import mongoose, { Schema, Document, Model } from "mongoose";

export enum Currency {
  USD = "USD",
  EUR = "EUR",
  GDB = "GDB",
  NGN = "NGN",
}

export enum Frequency {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

export enum Category {
  SPORTS = "sports",
  NEWS = "news",
  ENTERTAINMENT = "entertainment",
  LIFESTYLE = "lifestyle",
  FINANCE = "finance",
  TECHNOLOGY = "technology",
  POLITICS = "politics",
  OTHER = "other",
}

export enum SubscriptionStatus {
  ACTIVE = "active",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
}

export interface ISubscription extends Document {
  name: string;
  price: number;
  currency: Currency;
  frequency: Frequency;
  category: Category;
  paymentMethod: string;
  status: SubscriptionStatus;
  startDate: Date;
  renewalDate: Date;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    name: {
      type: String,
      required: [true, "Subscription Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    price: {
      type: Number,
      required: [true, "Subscription Price is required"],
      min: [0, "Price must be greater than zero"],
    },
    currency: {
      type: String,
      enum: Object.values(Currency),
      default: Currency.NGN,
    },
    frequency: {
      type: String,
      enum: Object.values(Frequency),
      required: true,
    },
    category: {
      type: String,
      enum: Object.values(Category),
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      default: SubscriptionStatus.ACTIVE,
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value: Date) => value <= new Date(),
        message: "Start Date must be in the past",
      },
    },
    renewalDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value: Date) {
          return value >= (this as any).startDate;
        },
        message: "Renewal Date must be after the start date",
      },
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

subscriptionSchema.pre<ISubscription>("save", function () {
  if (!this.renewalDate) {
    const renewalDays: Record<Frequency, number> = {
      [Frequency.DAILY]: 1,
      [Frequency.WEEKLY]: 7,
      [Frequency.MONTHLY]: 30,
      [Frequency.YEARLY]: 365,
    };

    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(
      this.renewalDate.getDate() + renewalDays[this.frequency],
    );
  }

  if (this.renewalDate < new Date()) {
    this.status = SubscriptionStatus.EXPIRED;
  }

});

const Subscription: Model<ISubscription> = mongoose.model<ISubscription>(
  "Subscription",
  subscriptionSchema,
);

export default Subscription;
