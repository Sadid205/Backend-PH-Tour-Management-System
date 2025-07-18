import { model, Schema } from "mongoose";

const divisionSchema = new Schema<IDivision>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: false, unique: true },
    thumbnail: { type: String },
    description: { type: String },
  },
  { timestamps: true, versionKey: false }
);

divisionSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    const slugText = this.name?.split(" ").join("-").toLowerCase();
    let slug = `${slugText}-division`;

    let counter = 0;
    while (await Division.exists({ slug: slug })) {
      slug = `${slug}-${counter++}`;
    }

    this.slug = slug;
  }
  next();
});

divisionSchema.pre("findOneAndUpdate", async function (next) {
  const division = this.getUpdate() as Partial<IDivision>;

  if (division.name) {
    const slugText = division.name?.split(" ").join("-").toLowerCase();
    let slug = `${slugText}-division`;

    let counter = 0;
    while (await Division.exists({ slug: slug })) {
      slug = `${slug}-${counter++}`;
    }

    division.slug = slug;
  }
  this.setUpdate(division);
  next();
});

export const Division = model<IDivision>("Division", divisionSchema);
