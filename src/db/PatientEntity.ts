import mongoose, { Schema, Types } from 'mongoose'
import Patient from '../model/Patient'

const PatientSchema = new Schema({
  id: Types.ObjectId,
  code: String,
  name: Object,
})

export default mongoose.model<Patient>('Patient', PatientSchema)
