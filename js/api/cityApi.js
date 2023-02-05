import axiosClient from './axiosClient';

export function getAllCities(params) {
  const url = '/cities';
  return axiosClient.get(url, {
    params,
  });
}

export function getCityById(id) {
  const url = `/cities/${id}`;
  return axiosClient.get(url);
}
