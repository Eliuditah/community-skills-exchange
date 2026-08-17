// Service for managing notifications
export const NotificationService = {
  sendExchangeRequest: (requesterName, skillName) => {
    return {
      title: 'New Exchange Request',
      message: `${requesterName} wants to exchange for your skill: ${skillName}`,
      type: 'exchange_request',
      icon: '🔄'
    };
  },

  sendExchangeAccepted: (providerName, skillName) => {
    return {
      title: 'Exchange Accepted! 🎉',
      message: `${providerName} accepted your exchange request for ${skillName}`,
      type: 'exchange_accepted',
      icon: '✅'
    };
  },

  sendExchangeCompleted: (requesterName, skillName) => {
    return {
      title: 'Exchange Completed! 🎊',
      message: `${requesterName} completed the exchange for ${skillName}`,
      type: 'exchange_completed',
      icon: '⭐'
    };
  },

  sendNewReview: (reviewerName, rating) => {
    return {
      title: 'New Review Received! 💬',
      message: `${reviewerName} gave you a ${rating}⭐ rating`,
      type: 'new_review',
      icon: '📝'
    };
  },

  sendSkillMatched: (skillName) => {
    return {
      title: 'Perfect Match Found! 🎯',
      message: `A user needs your skill: ${skillName}`,
      type: 'skill_match',
      icon: '🤝'
    };
  }
};