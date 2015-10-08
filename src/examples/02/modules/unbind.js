// Create functions from prototype methods, to avoid using call.
const unbind = Function.prototype.bind.bind(Function.prototype.call);

export const slice = unbind(Array.prototype.slice);

// Check if the first argument has a given property name.
export const hasOwn = unbind(Object.prototype.hasOwnProperty);

// Get the string tag of an object.
export const getStringTag = unbind(Object.prototype.toString);

export default unbind;
