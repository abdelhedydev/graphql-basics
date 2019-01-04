const Subscription = {
  count: {
    subscribe: (parent, args, { pubsub }) => {
      let count = 0
      setInterval(() => {
        count++
        pubsub.publish('Counter', { count })
      }, 1000)
      return pubsub.asyncIterator('Counter')
    }
  },
  comment: {
    subscribe: (parent, { postId }, { db, pubsub }, info) => {
      const post = db.posts.find(p => p.id === postId)
      if (!post) throw new Error('Post not found')

      return pubsub.asyncIterator(`Comment ${postId}`)
    }
  }
}
export { Subscription as default }
