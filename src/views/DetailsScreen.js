import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import { TextInput } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: 'black',
  },
});
class DetailsScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {},
            isLoading: true,
            isFavorite: false,
            starRating: 0, // New state for star rating
        };
        this.state.data = this.props.route.params.selectedItem;
    }

    // Function to toggle favorite status
    toggleFavorite = async () => {
        const { isFavorite, data } = this.state;
        try {
            // Retrieve the liked items from AsyncStorage
            const likedItemsString = await AsyncStorage.getItem('likedItems');
            let likedItems = likedItemsString ? JSON.parse(likedItemsString) : [];

            // Toggle the favorite status
            const index = likedItems.findIndex(item => item.idMeal === data.idMeal);
            if (index !== -1) {
                likedItems.splice(index, 1); // Remove from liked items
            } else {
                likedItems.push(data); // Add to liked items
            }

            // Save the updated liked items to AsyncStorage
            await AsyncStorage.setItem('likedItems', JSON.stringify(likedItems));

            this.setState({ isFavorite: !isFavorite });
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    // Function to check if the item is liked
    checkIfLiked = async () => {
        try {
            // Retrieve the liked items from AsyncStorage
            const likedItemsString = await AsyncStorage.getItem('likedItems');
            const likedItems = likedItemsString ? JSON.parse(likedItemsString) : [];

            // Check if the current item is liked
            const isFavorite = likedItems.some(item => item.idMeal === this.state.data.idMeal);

            this.setState({ isFavorite, isLoading: false });
        } catch (error) {
            console.error('Error checking liked items:', error);
        }
    };
    generateRandomStarRating = () => {
        const minRating = 3; // Minimum rating
        const maxRating = 5; // Maximum rating
        const randomRating = Math.random() * (maxRating - minRating) + minRating;
        return Math.round(randomRating * 10) / 10; // Round to one decimal place
    };
    
    // Function to render stars based on the star rating
    renderStars = () => {
        const { starRating } = this.state;
        const fullStars = Math.floor(starRating);
        const halfStar = starRating - fullStars >= 0.5;

        const stars = [];
        for (let i = 0; i < fullStars; i++) {
            stars.push(<FontAwesome key={i} name="star" size={24} color="gold" />);
        }
        if (halfStar) {
            stars.push(<FontAwesome key="half" name="star-half" size={24} color="gold" />);
        }

        // Fill the remaining stars with the outline
        const remainingStars = 5 - fullStars - (halfStar ? 1 : 0);
        for (let i = 0; i < remainingStars; i++) {
            stars.push(<FontAwesome key={`empty-${i}`} name="star-o" size={24} color="gold" />);
        }

        return <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>{stars}</View>;
    };

    // Function to handle rating input
    handleRatingChange = (text) => {
        const rating = parseFloat(text);
        if (!isNaN(rating) && rating >= 0 && rating <= 5) {
            this.setState({ starRating: rating });
        }
    };

    // Function to submit the user's rating
    submitRating = () => {
        console.log('Submitted Rating:', this.state.starRating);
    };
    renderRatingStars = () => {
        const { starRating } = this.state;
        const stars = [];

        for (let i = 1; i <= 5; i++) {
            const filled = i <= Math.round(starRating);
            const iconName = filled ? 'star' : 'star-o';
            const starColor = filled ? 'gold' : 'gray';

            stars.push(
                <TouchableOpacity key={i} onPress={() => this.setState({ starRating: i })}>
                    <FontAwesome name={iconName} size={32} color={starColor} style={{ marginHorizontal: 5 }} />
                </TouchableOpacity>
            );
        }

        return <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>{stars}</View>;
    };

    // Function to submit the user's rating
    submitRating = () => {
        // You can add the logic here to handle the submitted rating, e.g., send it to a server
        // For now, let's just log it
        console.log('Submitted Rating:', this.state.starRating);
    };

    render() {
        if (this.state.data.strInstructions != undefined) {
            this.state.isLoading = false;
        }
        let ingredients = [];
        const { data, isLoading, isFavorite } = this.state;

        for (let i = 1; i <= 20; i++) {
            if (data['strIngredient' + (i)] !== "" && data['strMeasure' + (i)] !== "") {
                let ingr = {};
                ingr.ingredient = data['strIngredient' + (i)];
                ingr.measure = data['strMeasure' + (i)];
                ingredients.push(ingr);
            }
        }

        // Split instructions into an array of lines
        const instructionsLines = (data.strInstructions || '').split('\n').filter(line => line.trim() !== '');

        return (
            ((isLoading) ? <View style={{
                alignItems: 'center',
                flex: 1,
                justifyContent: 'center'
            }}>
                <ActivityIndicator size="large" />
            </View> :
                <ScrollView style={{ flex: 1 }}>
                    <View>
                        <Image
                            source={{
                                uri: data.strMealThumb,
                                cache: 'only-if-cached',
                            }}
                            style={{ width: '100%', height: undefined, aspectRatio: 1.1 }}
                        />
                        
                        <View style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'white',
                            height: 30,
                            alignSelf: 'flex-end',
                            borderTopStartRadius: 30,
                            borderTopEndRadius: 30
                        }} />
                    </View>
                    <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingHorizontal: 20,
                            alignItems: 'center',
                            marginTop: 10,
                        }}>
                            <Text style={{ fontSize: 18 }}>Rating: {this.state.starRating}</Text>
                            {/* Display stars */}
                            {this.renderStars()}
                        </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: 20,
                        alignItems: 'center',
                    }}>
                        <Text
                            style={{
                                fontSize: 24,
                                color: 'black',
                                fontWeight: 'bold'
                            }}>{data.strMeal}</Text>
                        {/* Heart icon for favorite */}
                        <TouchableOpacity
                            onPress={this.toggleFavorite}
                            style={{ padding: 20 }}
                        >
                            <MaterialCommunityIcons
                                name={isFavorite ? 'heart' : 'heart-outline'}
                                size={30}
                                color={isFavorite ? 'red' : 'black'}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        paddingHorizontal: 20
                    }}>
                        <Text style={{
                            fontSize: 16
                        }}>Category: {data.strCategory}</Text>
                        <Text style={{
                            fontSize: 16
                        }}>Tags: {data.strTags}</Text>
                    </View>
                    <View style={{
                        paddingHorizontal: 20
                    }}>
                        <Text style={{
                            fontSize: 16
                        }}></Text>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 20 }}
                    >
                        {ingredients
                            .filter(item => item.ingredient && item.measure) // Filter out empty items
                            .map((item, index) => (
                                <View key={index} style={{
                                    width: 150, // Set a fixed width for each item
                                    marginHorizontal: 6,
                                    alignItems: 'center',
                                }}>
                                    <View style={{
                                        width: '100%',
                                        paddingVertical: 5,
                                        paddingHorizontal: 10,
                                        borderColor: '#C5C5C5',
                                        borderWidth: 1,
                                        borderRadius: 12,
                                        alignItems: 'center',
                                    }}>
                                        <Text numberOfLines={1}>{item.ingredient}</Text>
                                        <Text numberOfLines={1}>{item.measure}</Text>
                                    </View>
                                </View>
                            ))}
                    </ScrollView>
                    <View style={{ paddingHorizontal: 20 }}>
                        <Text
                            style={{
                                fontSize: 21,
                                fontWeight: 'bold', // Make the heading bold
                                color: 'black',
                            }}>Instructions:</Text>
                        {/* Display instructions as bullet points */}
                        <View>
                            {instructionsLines.map((line, index) => (
                                <View key={index} style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 5 }}>
                                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'black', marginTop: 1 }}>{'\u2022'}</Text>
                                    <Text style={{ fontSize: 18, color: 'black', marginLeft: 5 }}>{line}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                    <View style={{
                        paddingHorizontal: 20
                    }}>
                        
                        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
                        <Text style={{ fontSize: 21, fontWeight: 'bold', color: 'black' }}>Your Rating:</Text>
                        {this.renderRatingStars()}
                        <TouchableOpacity style={styles.ratingButton} onPress={this.submitRating}>
                            <Text style={{ color: 'white' }}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{
                            fontSize: 16
                        }}></Text>
                    </View>

                </ScrollView>)
        );
    }

    async getMeal(id) {
        try {
            // fetching trending meals
            const response = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id);
            const json = await response.json();
            this.setState({ data: json.meals[0] });
        } catch (error) {
            console.error('Error fetching meal:', error);
        } finally {
            this.checkIfLiked(); // Check if the item is liked after fetching the meal
        }
    }

    componentDidMount() {
        if (this.state.data.strInstructions == undefined) {
            this.getMeal(this.state.data.idMeal);
        } else {
            this.setState({ starRating: this.generateRandomStarRating() }, () => {
                this.checkIfLiked(); // Check if the item is liked when the component mounts
            });
        }
    }

}

export default DetailsScreen;


// ---------------------------------------------------------------------------------







