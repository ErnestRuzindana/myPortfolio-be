import mongoose from "mongoose";
import projectsModel from "../models/projectsModel.js";
import projectsValidationSchema from "../validations/projectsValidation.js";
import cloudinary from "../helpers/cloudinary.js";

// Create a Project
const createProject = async(request, response) =>{

    try{
        //Validation
        const {error} = projectsValidationSchema.validate(request.body)

        if (error)
            return response.status(400).json({"validationError": error.details[0].message})

        const projectImageResult = await cloudinary.uploader.upload(request.body.projectImage, {
            folder: "Ernest's Post Images"
        })

        const newProject = new projectsModel({
            projectTitle : request.body.projectTitle,
            projectLink : request.body.projectLink,
            projectImage : projectImageResult.secure_url,
        });

        const Project = await newProject.save()

        response.status(200).json({
            "successMessage": "Project created successfully!",
            "projectContent": Project
        })
    }

    catch(error){
        console.log(error);
        response.status(500).json({
            "status": "fail", 
            "message": error.message
        })
        
    }
}


// Getting all the Projects
const getAllProjects = async(request, response) =>{
    try{

        let query=[];

        // Sort functionality
        if(request.query.sortBy && request.query.sortOrder){
			var sort = {};
			sort[request.query.sortBy] = (request.query.sortOrder=='asc')?1:-1;
			query.push({
				$sort: sort
			});
		}else{
			query.push({
				$sort: {createdAt:-1}
			});	
		}

        // Pagination functionality
        let total = await projectsModel.countDocuments(query);
		let page=(request.query.page)?parseInt(request.query.page):1;
		let perPage=(request.query.perPage)?parseInt(request.query.perPage):6;
		let skip=(page-1)*perPage;
		query.push({
			$skip:skip,
		});
		query.push({
			$limit:perPage,
		});


        // Only show needed fields
         query.push(
	    	{ 
	    		$project : {
    			"_id":1,
	    		"projectTitle": 1,
				"projectImage":1,
				"projectLink":1
	    		} 
	    	}
	    );
        
        const allProjects = await projectsModel.aggregate(query);

        if (allProjects){
            response.status(200).json({
                "successMessage": "Projects fetched successfully!",
                "allAvailableProjects": allProjects,
                "paginationDetails":{
                    total:total,
                    currentPage:page,
                    perPage:perPage,
                    totalPages:Math.ceil(total/perPage)
                }
            })
        }

        else{
            response.status(400).json({"ProjectError": "Projects not found"})  
        }
    }

    catch(error){
        console.log(error);
        response.status(500).json({
            "status": "fail", 
            "message": error.message
        })
    }
}

// Get Single Project

const getSingleProject = async(request, response) =>{
    try{
        const project = await projectsModel.findOne({_id: request.query.projectId});

        response.status(200).json({
            "successMessage": "Successfully retrieved the project!",
            "fetchedProject": project
        })
    }

    catch(error){
        console.log(error);
        response.status(500).json({
            "status": "fail", 
            "message": error.message
        })
    }
}


// Update a Project

const updateProject = async(request, response) =>{
    try{

        let projectId = request.query.projectId;

        const Project = await projectsModel.findOne({_id: projectId});

        if (Project){

            if (request.body.projectImage) {
                const projectImageResult = await cloudinary.uploader.upload(request.body.projectImage, {
                    folder: "Ernest's Post Images"
                })

                Project.projectTitle = request.body.projectTitle || Project.projectTitle,
                Project.projectLink = request.body.projectLink || Project.projectLink,
                Project.projectImage = projectImageResult.secure_url || Project.projectImage

              } else {
                
                Project.projectTitle = request.body.projectTitle || Project.projectTitle,
                Project.projectLink = request.body.projectLink || Project.projectLink
                
              }

            await Project.save()

            response.status(200).json({
                "projectUpdateSuccess": "Project updated successfully!",
                "updatedProject": Project
            })

        }

        else{
            response.status(400).json({
                "ProjectUpdateError": "Project not found!"
            })
        }
    }

    catch(error){
        console.log(error);
        response.status(500).json({
            "status": "fail", 
            "message": error.message
        })
    }
}


// Delete a Project
const deleteProject = async(request, response) =>{
    try{
		let project_id = request.params.project_id;

		if(!mongoose.Types.ObjectId.isValid(project_id)){
			return response.status(400).json({
				"invalidId":'Something went wrong, refresh your page and try again!',
			});
		}

        const Project = await projectsModel.findOne({_id: project_id});

		if (Project){

				await Project.deleteOne()

				response.status(200).json({
					"deletedProject": `Project deleted successfully!`
				})

        }

        else{
            response.status(400).json({
                "ProjectUpdateError": "Project not found!"
            })
        }

        

    }

    catch(error){
        console.log(error);
        response.status(500).json({
            "status": "fail", 
            "message": error.message
        })
    }
}


export default { createProject, getAllProjects, getSingleProject, updateProject, deleteProject };