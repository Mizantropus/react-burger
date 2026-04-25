import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ingredientDetails: null,
};

const ingredientDetailsSlice = createSlice({
  name: 'ingredientDetails',
  initialState,
  reducers: {
    setIngredientDetails: (state, action) => {
      state.ingredientDetails = action.payload;
    },
    clearIngredientDetails: (state) => {
      state.ingredientDetails = null;
    },
  },
});

export const { setIngredientDetails, clearIngredientDetails } =
  ingredientDetailsSlice.actions;
export default ingredientDetailsSlice.reducer;
