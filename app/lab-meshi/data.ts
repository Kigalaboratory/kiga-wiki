import { Dish } from '../types';

export const sampleDishes: Dish[] = [
  { 
    id: 1, 
    name: '究極のペペロンチーノ', 
    reviews: [
      { chef: 'シェフ大泉', comment: '究極の一品を作り上げました！' }
    ]
  },
  { 
    id: 2, 
    name: 'きのこリゾット', 
    reviews: [
      { chef: 'パパ', comment: '研究室で採れたきのこを使用した贅沢な一品' }
    ]
  },
];
