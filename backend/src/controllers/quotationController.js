const Quotation = require('../models/Quotation');
const Enquiry = require('../models/Enquiry');

// @desc    Get all quotations with filters & search
// @route   GET /api/quotations
// @access  Private (Admin Only)
const getQuotations = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.status && req.query.status !== 'All') {
      filter.status = req.query.status;
    }

    if (req.query.search && req.query.search.trim()) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      filter.$or = [
        { quotationNumber: searchRegex },
        { customerName: searchRegex },
        { customerEmail: searchRegex },
        { customerPhone: searchRegex },
        { title: searchRegex },
      ];
    }

    const quotations = await Quotation.find(filter)
      .populate('enquiry', 'fullName phone service budget')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: quotations.length,
      data: quotations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single quotation by ID
// @route   GET /api/quotations/:id
// @access  Private (Admin Only)
const getQuotationById = async (req, res, next) => {
  try {
    const quotation = await Quotation.findById(req.params.id).populate('enquiry');
    if (!quotation) {
      return res.status(404).json({ success: false, message: 'Quotation not found.' });
    }
    res.status(200).json({ success: true, data: quotation });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new quotation
// @route   POST /api/quotations
// @access  Private (Admin Only)
const createQuotation = async (req, res, next) => {
  try {
    const count = await Quotation.countDocuments();
    const quotationNumber = `WT-QUOTE-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const {
      enquiryId,
      customerName,
      customerEmail,
      customerPhone,
      companyName,
      title,
      description,
      items,
      taxPercent = 18,
      validUntil,
      termsAndConditions,
      status = 'Draft',
      notes,
    } = req.body;

    // Calculate subtotal and tax
    const parsedItems = Array.isArray(items) ? items : [];
    let subtotal = 0;
    const computedItems = parsedItems.map((item) => {
      const qty = Number(item.quantity) || 1;
      const prc = Number(item.price) || 0;
      const amt = qty * prc;
      subtotal += amt;
      return {
        description: item.description || 'Service Deliverable',
        quantity: qty,
        price: prc,
        amount: amt,
      };
    });

    const taxAmount = (subtotal * Number(taxPercent)) / 100;
    const total = subtotal + taxAmount;

    const quotation = await Quotation.create({
      quotationNumber,
      enquiry: enquiryId || null,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      customerPhone: customerPhone.trim(),
      companyName: companyName ? companyName.trim() : '',
      title: title.trim(),
      description: description ? description.trim() : '',
      items: computedItems,
      subtotal,
      taxPercent: Number(taxPercent),
      taxAmount,
      total,
      validUntil: validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      termsAndConditions,
      status,
      notes: notes ? notes.trim() : '',
    });

    // If linked to an enquiry, update enquiry status to Contacted
    if (enquiryId) {
      await Enquiry.findByIdAndUpdate(enquiryId, {
        status: 'Contacted',
        $push: {
          contactHistory: {
            date: new Date(),
            channel: 'Quotation Generated',
            notes: `Generated Quotation ${quotationNumber} for ₹${total}`,
            createdBy: 'Admin',
          },
        },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Quotation created successfully.',
      data: quotation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update quotation
// @route   PUT /api/quotations/:id
// @access  Private (Admin Only)
const updateQuotation = async (req, res, next) => {
  try {
    let quotation = await Quotation.findById(req.params.id);
    if (!quotation) {
      return res.status(404).json({ success: false, message: 'Quotation not found.' });
    }

    const { items, taxPercent, status, notes, termsAndConditions, validUntil, title, description } = req.body;

    if (items && Array.isArray(items)) {
      let subtotal = 0;
      quotation.items = items.map((item) => {
        const qty = Number(item.quantity) || 1;
        const prc = Number(item.price) || 0;
        const amt = qty * prc;
        subtotal += amt;
        return {
          description: item.description,
          quantity: qty,
          price: prc,
          amount: amt,
        };
      });
      quotation.subtotal = subtotal;
      const tPercent = taxPercent !== undefined ? Number(taxPercent) : quotation.taxPercent;
      quotation.taxPercent = tPercent;
      quotation.taxAmount = (subtotal * tPercent) / 100;
      quotation.total = subtotal + quotation.taxAmount;
    }

    if (status) quotation.status = status;
    if (notes !== undefined) quotation.notes = notes;
    if (termsAndConditions !== undefined) quotation.termsAndConditions = termsAndConditions;
    if (validUntil) quotation.validUntil = validUntil;
    if (title) quotation.title = title;
    if (description !== undefined) quotation.description = description;

    await quotation.save();

    res.status(200).json({
      success: true,
      message: 'Quotation updated successfully.',
      data: quotation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete quotation
// @route   DELETE /api/quotations/:id
// @access  Private (Admin Only)
const deleteQuotation = async (req, res, next) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) {
      return res.status(404).json({ success: false, message: 'Quotation not found.' });
    }

    await quotation.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Quotation deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getQuotations,
  getQuotationById,
  createQuotation,
  updateQuotation,
  deleteQuotation,
};

