import { model, Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";
import { string } from "zod";

const tourTypeSchema = new Schema<ITourType>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true, versionKey: false }
);

export const TourType = model<ITourType>("TourType", tourTypeSchema);

const tourSchema = new Schema<ITour>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: false, unique: true },
    description: { type: String },
    images: { type: [String], default: [] },
    location: { type: String },
    costForm: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    aminities: { type: [String], default: [] },
    tourPlane: { type: [String], default: [] },
    maxGuest: { type: Number },
    minAge: { type: Number },
    division: { type: Schema.Types.ObjectId, ref: "Division", required: true },
    tourType: { type: Schema.Types.ObjectId, ref: "TourType", required: true },
  },
  { timestamps: true }
);

tourSchema.pre("save", async function (next) {
  if (this.isModified("title")) {
    const slugText = this.title?.split(" ").join("-").toLowerCase();
    let slug = `${slugText}`;

    let counter = 0;
    while (await Tour.exists({ slug: slug })) {
      slug = `${slug}-${counter++}`;
    }

    this.slug = slug;
  }
  next();
});

tourSchema.pre("findOneAndUpdate", async function (next) {
  const tour = this.getUpdate() as Partial<ITour>;

  if (tour.title) {
    const slugText = tour.title?.split(" ").join("-").toLowerCase();
    let slug = `${slugText}`;

    let counter = 0;
    while (await Tour.exists({ slug: slug })) {
      slug = `${slug}-${counter++}`;
    }

    tour.slug = slug;
  }
  this.setUpdate(tour);
  next();
});

export const Tour = model<ITour>("Tour", tourSchema);
