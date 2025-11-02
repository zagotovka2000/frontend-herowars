import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
