import { ObjectId } from 'mongodb';

export class Member {
  constructor({
    firstName,
    lastName,
    email,
    phone,
    profession,
    company,
    address,
    city,
    postalCode,
    country = 'France',
    membershipType = 'individual',
    plan = 'annual',
    acceptTerms = false,
    paymentStatus = 'pending',
    status = 'pending',
    joinDate = new Date(),
  }) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email.toLowerCase();
    this.phone = phone;
    this.profession = profession;
    this.company = company;
    this.address = address;
    this.city = city;
    this.postalCode = postalCode;
    this.country = country;
    this.membershipType = membershipType;
    this.plan = plan;
    this.acceptTerms = acceptTerms;
    this.paymentStatus = paymentStatus;
    this.status = status;
    this.joinDate = joinDate;
    this.expiryDate = this.calculateExpiryDate();
    this.amount = this.calculateAmount();
    this.membershipNumber = this.generateMembershipNumber();
  }

  calculateExpiryDate() {
    const expiry = new Date(this.joinDate);
    expiry.setFullYear(expiry.getFullYear() + 1);
    return expiry;
  }

  calculateAmount() {
    const prices = {
      'student': 25,
      'individual': 80,
      'corporate': 350
    };
    return prices[this.membershipType] || 80;
  }

  generateMembershipNumber() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `COS${year}${random}`;
  }

  validate() {
    const errors = [];

    if (!this.firstName || this.firstName.trim().length === 0) {
      errors.push('Le prénom est obligatoire');
    }

    if (!this.lastName || this.lastName.trim().length === 0) {
      errors.push('Le nom est obligatoire');
    }

    if (!this.email || !this.isValidEmail(this.email)) {
      errors.push('Un email valide est obligatoire');
    }

    if (!this.profession || this.profession.trim().length === 0) {
      errors.push('La profession est obligatoire');
    }

    if (!this.acceptTerms) {
      errors.push('Vous devez accepter les conditions générales');
    }

    return errors;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  toJSON() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      profession: this.profession,
      company: this.company,
      address: this.address,
      city: this.city,
      postalCode: this.postalCode,
      country: this.country,
      membershipType: this.membershipType,
      plan: this.plan,
      amount: this.amount,
      membershipNumber: this.membershipNumber,
      joinDate: this.joinDate,
      expiryDate: this.expiryDate,
      status: this.status,
      paymentStatus: this.paymentStatus
    };
  }
}