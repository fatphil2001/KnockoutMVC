var studentRegisterViewModel;

// use as register student views view model
function Student(id, firstName, lastName, age, description, gender) {
    var self = this;

    
    // observable are update elements upon changes, also update on element data changes [two way binding]
    self.Id = ko.observable(id);
    self.FirstName = ko.observable(firstName);
    self.LastName = ko.observable(lastName);

    // create computed field by combining first name and last name
    self.FullName = ko.computed(function () {
        return self.FirstName() + " " + self.LastName();
    }, self);

    self.Age = ko.observable(age);
    self.Description = ko.observable(description);
    self.Gender = ko.observable(gender);

    // Non-editable catalog data - should come from the server
    self.genders = [
        "Male",
        "Female",
        "Other"
    ];

    self.addStudent = function () {
        var dataObject = ko.toJSON(this);

        // remove computed field from JSON data which server is not expecting
        delete dataObject.FullName;

        $.ajax({
            url: '/api/student',
            type: 'post',
            data: dataObject,
            contentType: 'application/json',
            success: function (data) {
                studentRegisterViewModel.studentListViewModel.students.push(new Student(data.Id, data.FirstName, data.LastName, data.Age, data.Description, data.Gender));

                self.Id(null);
                self.FirstName('');
                self.LastName('');
                self.Age('');
                self.Description('');
            }
        });
    };
}

// use as student list view's view model
function StudentList() {

    var self = this;

    // observable arrays are update binding elements upon array changes
    self.students = ko.observableArray([]);

    self.getStudents = function () {
        self.students.removeAll();

        // retrieve students list from server side and push each object to model's students list
        $.getJSON('/api/student', function (data) {
            $.each(data, function (key, value) {
                self.students.push(new Student(value.Id, value.FirstName, value.LastName, value.Age, value.Description, value.Gender));
            });
        });
    };


    // remove student. current data context object is passed to function automatically.
    self.removeStudent = function (student) {
        $.ajax({
            url: '/api/student/' + student.Id(),
            type: 'delete',
            contentType: 'application/json',
            success: function () {
                self.students.remove(student);
            }
        });
    };
}

function ImageHandler() {
    var self = this;
    //data = data || {};
    self.image = ko.observable(); //data.image);
    self.imageType = ko.observable(); //data.imageType);
    self.imageFile = ko.observable();
    self.imagePath = ko.observable();
    self.imageObjectURL = ko.observable();

    self.imageObjectURL.subscribe(function () {
        self.saveChangedImage(new imageDto(self.image(), self.imageType()));
    });
    self.imageSrc = ko.computed(function () {
        return self.imageType() + "," + self.image();
    });

    function imageDto(image, imageType) {
        var self = this;
        self.image = image;
        self.imageType = imageType;
        self.toJson = function () {
            var json = ko.toJSON(self);
            return json;
        };
    }


    self.saveChangedImage = function (imageDto) {
        $.ajax({
            url: 'api/image',
            type: 'put',
            contentType: 'application/json',
            data: imageDto,
            success: function () {
                alert('image sent');
            }
        });
    }

}

// create index view view model which contain two models for partial views
studentRegisterViewModel = {
    addStudentViewModel: new Student(),
    studentListViewModel: new StudentList(),
    ImageHandler : new ImageHandler()
};


// on document ready
$(document).ready(function () {
   


    var windowURL = window.URL || window.webkitURL;
    ko.bindingHandlers.file = {
        init: function (element, valueAccessor) {
            $(element).change(function () {
                var file = this.files[0];
                if (ko.isObservable(valueAccessor())) {
                    valueAccessor()(file);
                }
            });
        },

        update: function (element, valueAccessor, allBindingsAccessor) {
            var file = ko.utils.unwrapObservable(valueAccessor());
            var bindings = allBindingsAccessor();

            if (bindings.imageBase64 && ko.isObservable(bindings.imageBase64)) {
                if (!file) {
                    bindings.imageBase64(null);
                    bindings.imageType(null);
                } else {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var result = e.target.result || {};
                        var resultParts = result.split(",");
                        if (resultParts.length === 2) {
                            bindings.imageBase64(resultParts[1]);
                            bindings.imageType(resultParts[0]);
                        }

                        //Now update fileObjet, we do this last thing as implementation detail, it triggers post
                        if (bindings.fileObjectURL && ko.isObservable(bindings.fileObjectURL)) {
                            var oldUrl = bindings.fileObjectURL();
                            if (oldUrl) {
                                windowURL.revokeObjectURL(oldUrl);
                            }
                            bindings.fileObjectURL(file && windowURL.createObjectURL(file));
                        }
                    };
                    reader.readAsDataURL(file);
                }
            }
        }
    }

    // bind view model to referring view
    ko.applyBindings(studentRegisterViewModel);

    // load student data
    studentRegisterViewModel.studentListViewModel.getStudents();
});