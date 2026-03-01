class Api::CategoriesController < ApplicationController
  def index
    categories = Category.order(:name)
    render json: categories
  end

  def create
    category = Category.new(name: params[:category][:name])
    if category.save
      render json: category, status: :created
    else
      render json: { errors: category.errors.full_messages }, status: :unprocessable_entity
    end
  end
end