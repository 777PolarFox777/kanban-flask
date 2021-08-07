import { useDispatch as useReduxDispatch } from 'react-redux';
import type { Dispatch } from '@store/index';

export const useDispatch = () => useReduxDispatch<Dispatch>();
