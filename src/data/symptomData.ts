export interface SymptomData {
    category: string;
    title: string;
    description: string;
    symptoms: string[];
    possibleCauses: string[];
    severity: 'Low' | 'Medium' | 'High';
    recommendedActions: string[];
}

export const SYMPTOM_DATA: Record<string, SymptomData[]> = {
    digestive: [
        {
            category: 'Digestive Issues',
            title: 'Loss of Appetite',
            description: 'A guinea pig that stops eating or shows reduced interest in food is a serious concern that requires immediate attention.',
            symptoms: [
                'Refusing to eat favorite foods',
                'Reduced food intake',
                'Weight loss',
                'Lethargy',
                'Hunched posture'
            ],
            possibleCauses: [
                'Dental problems',
                'Gastrointestinal stasis',
                'Stress or environmental changes',
                'Illness or infection',
                'Pain from other conditions'
            ],
            severity: 'High',
            recommendedActions: [
                'Seek immediate veterinary care',
                'Monitor food and water intake',
                'Check for other symptoms',
                'Keep the guinea pig warm and comfortable',
                'Offer favorite foods to encourage eating'
            ]
        },
        {
            category: 'Digestive Issues',
            title: 'Diarrhea',
            description: 'Loose or watery stools can indicate serious digestive problems and can lead to dehydration quickly.',
            symptoms: [
                'Watery or loose stools',
                'Frequent bowel movements',
                'Wet or soiled fur around bottom',
                'Dehydration',
                'Lethargy'
            ],
            possibleCauses: [
                'Bacterial infection',
                'Parasites',
                'Dietary changes',
                'Stress',
                'Antibiotic use'
            ],
            severity: 'High',
            recommendedActions: [
                'Contact veterinarian immediately',
                'Keep the guinea pig hydrated',
                'Clean the cage thoroughly',
                'Monitor for other symptoms',
                'Avoid feeding fresh vegetables temporarily'
            ]
        },
        {
            category: 'Digestive Issues',
            title: 'Constipation',
            description: 'Difficulty passing stools or infrequent bowel movements can cause discomfort and health issues.',
            symptoms: [
                'Small, hard stools',
                'Straining to defecate',
                'Reduced appetite',
                'Abdominal discomfort',
                'Lethargy'
            ],
            possibleCauses: [
                'Dehydration',
                'Low fiber diet',
                'Lack of exercise',
                'Dental problems',
                'Intestinal blockage'
            ],
            severity: 'Medium',
            recommendedActions: [
                'Increase water intake',
                'Provide more hay',
                'Encourage exercise',
                'Monitor stool production',
                'Contact vet if symptoms persist'
            ]
        }
    ],
    respiratory: [
        {
            category: 'Respiratory Problems',
            title: 'Sneezing and Nasal Discharge',
            description: 'Respiratory symptoms in guinea pigs can progress rapidly and become life-threatening.',
            symptoms: [
                'Frequent sneezing',
                'Clear or colored nasal discharge',
                'Crusty nose',
                'Labored breathing',
                'Reduced activity'
            ],
            possibleCauses: [
                'Upper respiratory infection',
                'Bacterial infection',
                'Allergies',
                'Dust or poor air quality',
                'Stress'
            ],
            severity: 'High',
            recommendedActions: [
                'Seek veterinary care immediately',
                'Keep the guinea pig warm',
                'Improve air quality',
                'Reduce stress',
                'Monitor breathing patterns'
            ]
        },
        {
            category: 'Respiratory Problems',
            title: 'Labored Breathing',
            description: 'Difficulty breathing is a medical emergency that requires immediate veterinary attention.',
            symptoms: [
                'Rapid breathing',
                'Open-mouth breathing',
                'Wheezing sounds',
                'Chest movement while breathing',
                'Lethargy and weakness'
            ],
            possibleCauses: [
                'Pneumonia',
                'Heart disease',
                'Respiratory infection',
                'Allergic reaction',
                'Heat stress'
            ],
            severity: 'High',
            recommendedActions: [
                'Emergency veterinary care required',
                'Keep the guinea pig calm and cool',
                'Ensure good air circulation',
                'Monitor breathing rate',
                'Transport carefully to vet'
            ]
        }
    ],
    skin: [
        {
            category: 'Skin & Coat Issues',
            title: 'Hair Loss and Bald Patches',
            description: 'Hair loss can indicate various skin conditions, parasites, or underlying health issues.',
            symptoms: [
                'Patchy hair loss',
                'Bald spots',
                'Scratching or itching',
                'Red or irritated skin',
                'Dandruff or flaky skin'
            ],
            possibleCauses: [
                'Mites or lice',
                'Fungal infection',
                'Hormonal imbalance',
                'Stress or barbering',
                'Nutritional deficiency'
            ],
            severity: 'Medium',
            recommendedActions: [
                'Schedule veterinary examination',
                'Check for parasites',
                'Improve diet and nutrition',
                'Reduce stress factors',
                'Keep the cage clean'
            ]
        },
        {
            category: 'Skin & Coat Issues',
            title: 'Skin Lesions or Sores',
            description: 'Open wounds or sores on the skin can become infected and require medical treatment.',
            symptoms: [
                'Open wounds or sores',
                'Scabs or crusts',
                'Red, inflamed skin',
                'Pus or discharge',
                'Pain or sensitivity'
            ],
            possibleCauses: [
                'Fighting with cage mates',
                'Sharp objects in cage',
                'Bacterial infection',
                'Fungal infection',
                'Self-injury from scratching'
            ],
            severity: 'Medium',
            recommendedActions: [
                'Clean the wound gently',
                'Contact veterinarian',
                'Remove sharp objects from cage',
                'Separate fighting guinea pigs',
                'Monitor for infection signs'
            ]
        }
    ],
    behavioral: [
        {
            category: 'Behavioral Changes',
            title: 'Aggression or Irritability',
            description: 'Sudden changes in behavior, especially increased aggression, can indicate pain or stress.',
            symptoms: [
                'Biting or nipping',
                'Teeth chattering',
                'Charging at cage mates',
                'Refusing to be handled',
                'Hiding more than usual'
            ],
            possibleCauses: [
                'Pain or illness',
                'Hormonal changes',
                'Stress or environmental changes',
                'Territorial behavior',
                'Lack of socialization'
            ],
            severity: 'Medium',
            recommendedActions: [
                'Schedule veterinary check-up',
                'Identify and reduce stress factors',
                'Provide more hiding places',
                'Gradual reintroduction to handling',
                'Monitor for other symptoms'
            ]
        },
        {
            category: 'Behavioral Changes',
            title: 'Lethargy and Depression',
            description: 'A normally active guinea pig becoming lethargic is often a sign of illness or pain.',
            symptoms: [
                'Reduced activity level',
                'Sleeping more than usual',
                'Lack of interest in surroundings',
                'Hunched posture',
                'Reduced vocalization'
            ],
            possibleCauses: [
                'Illness or infection',
                'Pain',
                'Depression from loss of companion',
                'Environmental stress',
                'Nutritional deficiency'
            ],
            severity: 'High',
            recommendedActions: [
                'Seek veterinary care',
                'Monitor food and water intake',
                'Check for other symptoms',
                'Provide comfort and warmth',
                'Reduce stress factors'
            ]
        }
    ],
    'eye-ear': [
        {
            category: 'Eye & Ear Problems',
            title: 'Eye Discharge or Cloudiness',
            description: 'Eye problems can indicate infection, injury, or underlying health conditions.',
            symptoms: [
                'Watery or colored eye discharge',
                'Cloudy or hazy eyes',
                'Swollen eyelids',
                'Squinting or keeping eye closed',
                'Rubbing or scratching at eye'
            ],
            possibleCauses: [
                'Eye infection',
                'Corneal injury',
                'Dental problems affecting eye',
                'Respiratory infection',
                'Allergies'
            ],
            severity: 'Medium',
            recommendedActions: [
                'Schedule veterinary examination',
                'Keep the eye clean',
                'Avoid touching or rubbing',
                'Monitor for other symptoms',
                'Check for respiratory issues'
            ]
        },
        {
            category: 'Eye & Ear Problems',
            title: 'Ear Problems',
            description: 'Ear issues can cause pain and balance problems, and may indicate infection.',
            symptoms: [
                'Head tilting',
                'Scratching at ears',
                'Ear discharge or odor',
                'Loss of balance',
                'Circling behavior'
            ],
            possibleCauses: [
                'Ear infection',
                'Ear mites',
                'Inner ear problems',
                'Head injury',
                'Neurological issues'
            ],
            severity: 'Medium',
            recommendedActions: [
                'Contact veterinarian',
                'Keep ears clean and dry',
                'Monitor balance and coordination',
                'Check for other symptoms',
                'Avoid self-treatment'
            ]
        }
    ],
    urinary: [
        {
            category: 'Urinary Issues',
            title: 'Difficulty Urinating',
            description: 'Problems with urination can indicate serious conditions like bladder stones or infection.',
            symptoms: [
                'Straining to urinate',
                'Frequent attempts to urinate',
                'Small amounts of urine',
                'Blood in urine',
                'Crying or vocalizing while urinating'
            ],
            possibleCauses: [
                'Bladder stones',
                'Urinary tract infection',
                'Bladder sludge',
                'Dehydration',
                'Dietary issues'
            ],
            severity: 'High',
            recommendedActions: [
                'Seek immediate veterinary care',
                'Increase water intake',
                'Monitor urine output',
                'Check for blood in urine',
                'Adjust diet if recommended by vet'
            ]
        },
        {
            category: 'Urinary Issues',
            title: 'Excessive Urination',
            description: 'Increased urination can indicate diabetes, kidney problems, or other metabolic issues.',
            symptoms: [
                'Frequent urination',
                'Large amounts of urine',
                'Increased water consumption',
                'Weight loss',
                'Lethargy'
            ],
            possibleCauses: [
                'Diabetes',
                'Kidney disease',
                'Urinary tract infection',
                'Hormonal imbalance',
                'Dietary issues'
            ],
            severity: 'Medium',
            recommendedActions: [
                'Schedule veterinary examination',
                'Monitor water intake',
                'Check urine color and amount',
                'Monitor weight',
                'Adjust diet if needed'
            ]
        }
    ]
}; 