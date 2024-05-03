export const userAge = (date) => {
    const today = new Date()

    const todayYear = today.getFullYear()
    const todayMonth = today.getMonth() + 1
    const todayDay = today.getDate()

    const dateYear = date.getFullYear()
    const dateMonth = date.getMonth() + 1
    const dateDay = date.getDate()

    let age = todayYear - dateYear

    todayMonth < dateMonth
        ? age = age -= 1
        : age = age

    todayMonth === dateMonth
        ? todayDay < dateDay
            ? age = age -= 1
            : age = age
        : age = age


    return age
}