package com.korangle.www.korangle;

import java.util.Random;

public class Quote {

    static String[] quotes = {
            "An investment in knowledge pays the best interest. \n-  Benjamin Franklin",
            "Change is the end result of all true learning. \n- Leo Buscaglia",
            "Education is the passport to the future, for tomorrow belongs to those who prepare for it today. \n- Malcolm X",
            "The roots of education are bitter, but the fruit is sweet. \n- Aristotle",
            "The more that you read, the more things you will know, the more that you learn, the more places you’ll go.\n- Dr. Seuss",
            "Live as if you were to die tomorrow. Learn as if you were to live forever. \n- Mahatma Gandhi",
            "Education without values, as useful as it is, seems rather to make man a more clever devil. \n- C.S. Lewis",
            "Without education, we are in a horrible and deadly danger of taking educated people seriously. \n- G.K. Chesterton",
            "Education is not the filling of a pail, but the lighting of a fire. \n- W.B. Yeats",
            "Develop a passion for learning. If you do, you will never cease to grow. \n- Anthony J. D’Angelo",
            "Education is not preparation for life; education is life itself. \n- John Dewey",
            "Knowledge is power. Information is liberating. Education is the premise of progress, in every society, in every family. \n- Kofi Annan",
            "Education is a better safeguard of liberty than a standing army. \n- Edward Everett ",
            "They know enough who know how to learn. \n- Henry Adams",
            "Upon the subject of education … I can only say that I view it as the most important subject which we as a people may be engaged in.\n- Abraham Lincoln",
            "Learning is like rowing upstream: not to advance is to drop back. \n- Chinese proverb",
            "Nine-tenths of education is encouragement. \n- Anatole France",
            "Man can learn nothing except by going from the known to the unknown. \n- Claude Bernard",
            "Education is the ability to listen to almost anything without losing your temper or your self-confidence. \n- Robert Frost",
            "Learning is not attained by chance, it must be sought for with ardor and attended to with diligence.\n- Abigail Adams",
            "Educating the mind without educating the heart is no education at all. \n- Aristotle",
            "It is as impossible to withhold education from the receptive mind as it is impossible to force it upon the unreasoning.\n- Agnes Repplierg",
            "They cannot stop me. I will get my education, if it is in the home, school, or anyplace.\n- Malala Yousafzai",
            "I was reading the dictionary. I thought it was a poem about everything.\n- Steven Wright",
            "The man who reads nothing at all is better educated than the man who reads nothing but newspapers. \n- Thomas Jefferson",
            "Learning is not compulsory. Neither is survival.\n- Dr. W. Edwards Deming",
            "Learning is not the product of teaching. Learning is the product of the activity of learners.\n- John Holt",
            "Take the attitude of a student, never be too big to ask questions, never know too much to learn something new. \n-  Og Mandino",
            "Education is the most powerful weapon which you can use to change the world. \n- Nelson Mandela",
            "I agree that a love of reading is a great gift for a parent to pass on to his or her child. \n- Ann Brashares",
            "Whatever the cost of our libraries, the price is cheap compared to that of an ignorant nation. \n- Walter Cronkite",
            "To me education is a leading out of what is already there in the pupil’s soul. \n- Muriel Spark",
            "Education is the ability to meet life’s situations.- Dr. John G. Hibben",
            "Learning starts with failure; the first failure is the beginning of education. \n- John Hersey",
            "Intelligence plus character-that is the goal of true education. \n- Martin Luther King Jr.",
            "Education is for improving the lives of others and for leaving your community and world better than you found it. \n- Marian Wright Edelman",
            "Every act of conscious learning requires the willingness to suffer an injury to one’s self-esteem. That is why young children, before they are aware of their own self-importance, learn so easily. \n- Thomas Szasz",
            "You are always a student, never a master. You have to keep moving forward. \n- Conrad Hall",
            "The whole purpose of education is to turn mirrors into windows. \n- Sydney J. Harris",
            "Children have to be educated, but they have also to be left to educate themselves. \n- Ernest Dimnet",
            "Every artist was at first an amateur. \n- Ralph W. Emerson",
            "All men by nature desire to know.\n- Aristotle",
            "Education must not simply teach work \n- it must teach Life. \n- W. E. B. Du Bois",
            "Wisdom…. comes not from age, but from education and learning. \n- Anton Chekhov",
            "Education is a continual process, it’s like a bicycle… If you don’t pedal you don’t go forward. \n- George Weah",
            "Education is the best friend. An educated person is respected everywhere. Education beats the beauty and the youth. \n- Chanakya",
            "Education is not the filling of a pail, but the lighting of a fire. \n- William Butler Yeats",
            "A good education is a foundation for a better future. \n- Elizabeth Warren",
            "Give a girl an education and introduce her properly into the world, and ten to one but she has the means of settling well, without further expense to anybody. \n- Jane Austen",
            "Formal education will make you a living; self-education will make you a fortune. \n- Jim Rohn",
            "The more I live, the more I learn. The more I learn, the more I realize, the less I know. \n- Michel Legrand",
            "By seeking and blundering we learn. \n- Johann Wolfgang von Goethe",
            "Do you know the difference between education and experience? Education is when you read the fine print; experience is what you get when you don’t. \n- Pete Seeger",
            "Knowledge will bring you the opportunity to make a difference. \n- Claire Fagin",
            "When you take the free will out of education, that turns it into schooling. \n- John Taylor Gatto",
            "Only the educated are free.” \n- Epictetus",
            "Proper teaching is recognized with ease. You can know it without fail because it awakens within you that sensation which tells you this is something you have always known.” \n- Frank Herbert",
            "I think you learn more if you’re laughing at the same time. \n- Mary Ann Shaffer & Annie Barrows",
            "It is personal. That’s what an education does. It makes the world personal. \n- Cormac McCarthy",
            "The main hope of a nation lies in the proper education of its youth \n- Desiderius Erasmus Roterodamus",
            "Education is for improving the lives of others and for leaving your community and world better than you found it.\n- Marian Wright Edelman",
            "Give a man a fish and you feed him for a day; teach a man to fish and you feed him for a lifetime.\n- Maimonides",
            "Education’s purpose is to replace an empty mind with an open one.\n- Malcolm Forbes",
            "Democracy cannot succeed unless those who express their choice are prepared to choose wisely. The real safeguard of democracy, therefore, is education.\n- Franklin D. Roosevelt",
            "You can teach a student a lesson for a day; but if you can teach him to learn by creating curiosity, he will continue the learning process as long as he lives.\n- Clay P. Bedford",
            "Education is simply the soul of a society as it passes from one generation to another.\n- G.K. Chesterton",
            "There is nothing in a caterpillar that tells you it’s going to be a butterfly.\n- Buckminster Fuller",
    };
    
    public static String getQuote() {
        return quotes[(new Random()).nextInt(quotes.length)];
    }

}
