import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';

class RecipesListScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      areas: [],
      ingredients: [],
      selectedCategory: '',
      selectedArea: '',
      selectedIngredient: '',
      meals: [],
      isLoading: true,
    };
  }

  async componentDidMount() {
    await this.fetchCategories();
    await this.fetchAreas();
    await this.fetchIngredients();
    this.fetchMeals();
  }

  fetchCategories = async () => {
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
      const json = await response.json();
      this.setState({ categories: json.meals });
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  fetchAreas = async () => {
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
      const json = await response.json();
      this.setState({ areas: json.meals });
    } catch (error) {
      console.error('Error fetching areas:', error);
    }
  };

  fetchIngredients = async () => {
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
      const json = await response.json();
      this.setState({ ingredients: json.meals });
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    }
  };

  fetchMeals = async () => {
    const { selectedCategory, selectedArea, selectedIngredient } = this.state;
    let url = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

    if (selectedCategory) {
      url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`;
    } else if (selectedArea) {
      url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${selectedArea}`;
    } else if (selectedIngredient) {
      url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${selectedIngredient}`;
    }

    try {
      const response = await fetch(url);
      const json = await response.json();
      this.setState({ meals: json.meals, isLoading: false });
    } catch (error) {
      console.error('Error fetching meals:', error);
    }
  };

  handleCategoryChange = (value) => {
    this.setState({ selectedCategory: value, isLoading: true }, () => {
      this.fetchMeals();
    });
  };

  handleAreaChange = (value) => {
    this.setState({ selectedArea: value, isLoading: true }, () => {
      this.fetchMeals();
    });
  };

  handleIngredientChange = (value) => {
    this.setState({ selectedIngredient: value, isLoading: true }, () => {
      this.fetchMeals();
    });
  };

  renderGridItem = ({ item }) => (
    <TouchableOpacity
      style={styles.gridItemContainer}
      onPress={() => this.props.navigation.navigate('Details', { selectedItem: item })}
    >
      <Image source={{ uri: item.strMealThumb }} style={styles.gridItemImage} />
      <Text style={styles.gridItemTitle}>{item.strMeal}</Text>
    </TouchableOpacity>
  );

 render() {
  const {
    categories,
    areas,
    ingredients,
    selectedCategory,
    selectedArea,
    selectedIngredient,
    meals,
    isLoading,
  } = this.state;

  return (
    <View style={styles.container}>
      <View style={styles.dropdownContainer}>
        <View style={styles.dropdownItem}>
          <Text style={styles.dropdownTitle}>Category:</Text>
          <RNPickerSelect
            onValueChange={this.handleCategoryChange}
            items={categories.map((category) => ({ label: category.strCategory, value: category.strCategory }))}
            value={selectedCategory}
            placeholder={{ label: 'Select a category', value: '' }}
            style={pickerSelectStyles}
          />
        </View>
        <View style={styles.dropdownItem}>
          <Text style={styles.dropdownTitle}>Area:</Text>
          <RNPickerSelect
            onValueChange={this.handleAreaChange}
            items={areas.map((area) => ({ label: area.strArea, value: area.strArea }))}
            value={selectedArea}
            placeholder={{ label: 'Select an area', value: '' }}
            style={pickerSelectStyles}
          />
        </View>
        <View style={styles.dropdownItem}>
          <Text style={styles.dropdownTitle}>Ingredient:</Text>
          <RNPickerSelect
            onValueChange={this.handleIngredientChange}
            items={ingredients.map((ingredient) => ({
              label: ingredient.strIngredient,
              value: ingredient.strIngredient,
            }))}
            value={selectedIngredient}
            placeholder={{ label: 'Select an ingredient', value: '' }}
            style={pickerSelectStyles}
          />
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator size='large' style={styles.loader} />
      ) : (
        <FlatList
          data={meals}
          renderItem={this.renderGridItem}
          keyExtractor={(item) => item.idMeal}
          contentContainerStyle={styles.gridContainer}
          numColumns={2}
        />
      )}
    </View>
  );
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  loader: {
    marginTop: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  gridContainer: {
    justifyContent: 'space-between',
  },
  gridItemContainer: {
    flex: 1,
    margin: 5,
    backgroundColor: '#F7F7F7',
    padding: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gridItemImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 5,
  },
  gridItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
  },
});

export default RecipesListScreen;
