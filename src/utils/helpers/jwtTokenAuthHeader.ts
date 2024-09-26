export const getAuthHeaders = (): { Authorization: string } => {
  return {
    Authorization: 'Bearer ' + localStorage.getItem('jwtToken'),
  };
};
