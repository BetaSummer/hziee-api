class Grade {
  constructor(lessonName, credit, score, secondGrade, gpa) {
    this.lessonName = lessonName;
    this.credit = credit;
    this.score = score;
    this.secondGrade = secondGrade;
    this.gpa = gpa;
  }
  static checkIsPassed(score) {
    return !((score === '不及格' || score < 60));
  }
}

module.exports = Grade;
