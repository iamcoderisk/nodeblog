$(document).ready(function() {
	$(".delete-article").click(function(e) {
		$target = $(e.target);
		const id = $target.attr("data-id");
		$.ajax({
			type: "DELETE",
			url: "/article/" + id,
			success: function(response) {
				alert("deleted");
				window.location.href = "/";
			}
		});
	});
});
