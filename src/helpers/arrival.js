import pointInPolygon from 'point-in-polygon';

const hasArrived = (position, polygon) => pointInPolygon(position, polygon);

export { hasArrived };
