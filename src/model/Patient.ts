import { Entity } from './Entity'
import Name from './Name'

export default interface Patient extends Entity {
  name: Name
}
