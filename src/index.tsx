import LocationPicker from './components/LocationPicker';

export default LocationPicker;

export { default as AMap } from './components/CustomAMap';

export {
  IntlProvider,
  IntlConsumer,
  createIntl,
  IntlType,
  zhCNIntl,
  enUSIntl,
} from './contexts/IntlContext';
