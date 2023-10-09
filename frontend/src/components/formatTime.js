export function formatTime() {

    let now = new Date();

    let hours = now.getHours()
    let minutes = now.getMinutes()

    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();

    return `${year}-${month}-${day} ${hours}:${minutes}`
}

export function exactTime(date) {
    let now = new Date();
    let target = new Date(date);
    let diff = target - now;

    let minutes = Math.floor((diff / (1000 * 60)) % 60);
    let hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    let days = Math.floor(diff / (1000 * 60 * 60 * 24));

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    if (days > 1){
        return `${days} days left`
    }else if (days === 1){
        return `${days} day left`
    } else return `${hours}:${minutes} left`;

}

export default exactTime();
